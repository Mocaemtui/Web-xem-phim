import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, CircularProgress, Button, Chip, IconButton, Divider, FormControl, Select, MenuItem, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import "./WatchMovie.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import { getWatchData } from "../services/sourceManager";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const WatchMovie = () => {
  const { slug } = useParams();
  const query = useQuery();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedSource, setSelectedSource] = useState('auto');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const [posterUrl, setPosterUrl] = useState(null);

  const normalizeEpisodes = (raw = []) => {
    if (!Array.isArray(raw)) return [];
    return raw.map((ep, idx) => {
      const episode_number = ep.episode_number || ep.episodeNumber || ep.episode || ep.ep || (ep.no ? Number(ep.no) : undefined) || (ep.index ? Number(ep.index) : undefined) || (idx + 1);
      const video_url = ep.video_url || ep.videoUrl || ep.m3u8Url || ep.m3u8 || ep.file || ep.url || ep.src || null;
      return { ...ep, episode_number, video_url };
    });
  };

  useEffect(() => {
    const loadWatchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getWatchData(slug);
        
        // Transform the data to match the expected structure
        const movie = result.movie || result;
        const json = {
          ...movie,
          episodes: result.episodes || [],
          source: result.source || 'kkphim'
        };

        setData(json);
        const rawEps = json.episodes || json.movie?.episodes || [];
        const norm = normalizeEpisodes(rawEps);
        if (norm && norm.length > 0) {
          const epParam = parseInt(query.get('ep'), 10);
          if (epParam && norm.some(e => e.episode_number === epParam)) {
            setSelectedEpisode(epParam);
          } else {
            setSelectedEpisode(norm[0].episode_number);
          }
        }
        setPosterUrl(null);
      } catch (err) {
        console.error('Error loading watch data:', err);
        setError('Không thể tải dữ liệu xem phim');
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadWatchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    const fallback = 'data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22480%22 height=%22720%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23232a3a%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23fff%22 font-family=%22Arial%22 font-size=%2224%22>No Image</text></svg>';
    const movie = data?.movie || data;
    if (!movie?.poster_url) {
      setPosterUrl(fallback);
      return;
    }

    const image = new Image();
    image.onload = () => setPosterUrl(movie.poster_url);
    image.onerror = () => setPosterUrl(fallback);
    image.src = movie.poster_url;
  }, [data]);

  useEffect(() => {
    return () => {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(() => {});
      }
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress sx={{ color: '#FFD600' }} />
        <Typography sx={{ color: '#fff' }}>Đang tải...</Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ color: '#fff', fontSize: 18 }}>{error || "Không tìm thấy dữ liệu phim"}</Typography>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ color: '#fff', borderColor: '#fff' }}>
          Quay lại
        </Button>
      </Box>
    );
  }

  const movie = data.movie || data;
  const genres = data.genres || data.movie?.genres || [];
  const rawEpisodes = data.episodes || data.movie?.episodes || [];
  const episodes = normalizeEpisodes(rawEpisodes);
  const currentEpisode = (episodes || []).find(e => e.episode_number === selectedEpisode) || (episodes || [])[0];

  // Get available video sources from current episode
  const getVideoSources = () => {
    if (!currentEpisode) return [];
    const sources = [];
    
    if (currentEpisode.embedUrl || currentEpisode.embed_url) {
      sources.push({ id: 'embed', name: 'Embed Server', url: currentEpisode.embedUrl || currentEpisode.embed_url, type: 'embed' });
    }
    if (currentEpisode.video_url || currentEpisode.videoUrl) {
      sources.push({ id: 'direct', name: 'Direct Link', url: currentEpisode.video_url || currentEpisode.videoUrl, type: 'direct' });
    }
    if (currentEpisode.m3u8Url || currentEpisode.m3u8) {
      sources.push({ id: 'm3u8', name: 'HLS Stream', url: currentEpisode.m3u8Url || currentEpisode.m3u8, type: 'm3u8' });
    }
    if (currentEpisode.file) {
      sources.push({ id: 'file', name: 'File Server', url: currentEpisode.file, type: 'direct' });
    }
    
    // Add fallback sample video if no sources available
    if (sources.length === 0) {
      sources.push({ id: 'sample', name: 'Sample Video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'direct' });
    }
    
    return sources;
  };

  const videoSources = getVideoSources();
  const currentVideoSource = videoSources.find(s => s.id === selectedSource) || videoSources[0];

  const handleSourceChange = (sourceId) => {
    setSelectedSource(sourceId);
    setVideoError(false);
  };

  const handleRetry = () => {
    setSelectedSource('auto');
    setVideoError(false);
    window.location.reload();
  };

  if (!movie || !movie.title) {
    return <Box sx={{ color: '#fff', textAlign: 'center', marginTop: 60 }}>Không tìm thấy dữ liệu phim.</Box>;
  }

  const handleBack = () => {
    window.history.back();
  };

  const posterFallback = posterUrl || 'data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22480%22 height=%22720%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23232a3a%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23fff%22 font-family=%22Arial%22 font-size=%2224%22>No Image</text></svg>';

  return (
    <Box className="watch-movie-container">
      {/* Header */}
      <Box className="wm-movie-header">
        <IconButton 
          className="wm-back-btn" 
          onClick={handleBack} 
          title="Quay lại trang chi tiết phim"
          sx={{ color: '#fff', mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" className="wm-movie-title">Xem phim {movie.title}</Typography>
      </Box>

      {/* Source Selector */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ color: '#fff' }}>Nguồn phát:</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={selectedSource}
            onChange={(e) => handleSourceChange(e.target.value)}
            sx={{
              bgcolor: '#23242a',
              color: '#fff',
              '& .MuiSelect-icon': { color: '#fff' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD600' },
            }}
          >
            {videoSources.map((source) => (
              <MenuItem key={source.id} value={source.id} sx={{ color: '#fff' }}>
                {source.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton onClick={handleRetry} sx={{ color: '#fff', '&:hover': { color: '#FFD600' } }} title="Tải lại">
          <RefreshIcon />
        </IconButton>
        {videoError && (
          <Alert severity="error" sx={{ flex: 1, minWidth: 200 }}>
            Video không tải được. Hãy thử đổi nguồn.
          </Alert>
        )}
      </Box>

      {/* Video Player */}
      {currentVideoSource?.type === 'embed' ? (
        <Box className="wm-embed" sx={{width:'100%',height:'55vw',maxHeight:880, position: 'relative'}}>
          <iframe
            title={`embed-ep-${currentEpisode.episode_number}`}
            src={currentVideoSource.url}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-downloads"
            referrerPolicy="no-referrer-when-downgrade"
            sx={{ border: 'none' }}
            onError={() => setVideoError(true)}
          />
          <Box sx={{mt: 2, color:'#ddd', textAlign:'center'}}>
            <Typography variant="body2">Nếu video không hiển thị, hãy mở trong tab mới.</Typography>
            <Button 
              variant="outlined" 
              href={currentVideoSource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{mt: 1, color: '#fff', borderColor: '#fff', '&:hover': { borderColor: '#FFD600', color: '#FFD600' } }}
            >
              Mở nguồn ngoài trong tab mới
            </Button>
          </Box>
        </Box>
      ) : (
        <VideoPlayer
          ref={videoRef}
          src={currentVideoSource?.url}
          poster={posterFallback}
          onError={() => setVideoError(true)}
        />
      )}

      {/* Info & Actions */}
      <Box className="wm-info-actions">
        {/* Left: Poster + Info */}
        <Box className="wm-info-left">
          <Box className="wm-poster">
            <img
              src={posterFallback}
              alt="Poster"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22480%22 height=%22720%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23232a3a%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23fff%22 font-family=%22Arial%22 font-size=%2224%22>No Image</text></svg>';
              }}
              sx={{ width: '100%', borderRadius: 2 }}
            />
          </Box>
          <Box className="wm-info-main">
            <Typography variant="h4" className="wm-title">{movie.title}</Typography>
            {movie.original_title && (
              <Typography variant="subtitle1" className="wm-english-title">{movie.original_title}</Typography>
            )}
            
            {/* Badges */}
            <Box className="wm-badges" sx={{ mt: 2 }}>
              {movie.imdb_rating && (
                <Chip 
                  label={`IMDb ${Number(movie.imdb_rating).toFixed(1)}`}
                  sx={{ 
                    bgcolor: 'transparent', 
                    border: '2px solid #f5c518',
                    color: '#fff',
                    fontWeight: 600
                  }}
                />
              )}
              {movie.quality && (
                <Chip 
                  label={movie.quality}
                  sx={{ 
                    bgcolor: 'linear-gradient(135deg, #fff 60%, #ffe082 100%)',
                    color: '#222',
                    fontWeight: 700,
                    fontFamily: 'monospace'
                  }}
                />
              )}
              {movie.age_limit && (
                <Chip 
                  label={movie.age_limit}
                  sx={{ 
                    bgcolor: '#fff',
                    color: '#222',
                    fontWeight: 700,
                    fontFamily: 'monospace'
                  }}
                />
              )}
              {movie.release_year && (
                <Chip 
                  label={movie.release_year}
                  sx={{ 
                    bgcolor: 'transparent',
                    border: '2px solid #fff',
                    color: '#fff',
                    fontWeight: 700,
                    fontFamily: 'monospace'
                  }}
                />
              )}
              {movie.duration && (
                <Chip 
                  label={movie.duration}
                  sx={{ 
                    bgcolor: 'transparent',
                    border: '2px solid #fff',
                    color: '#fff',
                    fontWeight: 700,
                    fontFamily: 'monospace'
                  }}
                />
              )}
            </Box>

            {/* Genres */}
            <Box className="wm-tags" sx={{ mt: 2 }}>
              {genres.map(g => (
                <Chip
                  key={g.id || g.name}
                  label={g.name}
                  onClick={() => navigate(`/movies?genre=${encodeURIComponent(g.name)}`)}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: '#23242a',
                    color: '#fff',
                    border: '1px solid #444',
                    '&:hover': { 
                      bgcolor: '#333',
                      borderColor: '#FFD600',
                      color: '#FFD600'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Right: Description + Button */}
        <Box className="wm-info-right">
          <Typography variant="body1" className="wm-description" sx={{ color: '#ccc', lineHeight: 1.6 }}>
            {movie.description || "Không có mô tả"}
          </Typography>
          <Button 
            variant="outlined"
            className="wm-info-btn" 
            startIcon={<InfoIcon />}
            onClick={() => {
              const movieRoute = slug || movie.slug || movie.sourceSlug || movie.title_url || movie.id;
              navigate(`/movies/${movieRoute}`);
            }}
            sx={{ 
              mt: 2, 
              color: '#fff', 
              borderColor: '#fff',
              '&:hover': { 
                borderColor: '#FFD600',
                color: '#FFD600'
              }
            }}
          >
            Thông tin phim
          </Button>
        </Box>
      </Box>

      {/* Divider */}
      <Divider className="wm-divider" sx={{ borderColor: '#333', my: 4 }} />

      {/* Episodes Section */}
      <Typography variant="h5" className="wm-section-title" sx={{ color: '#fff', mb: 3 }}>
        Các bản chiếu
      </Typography>
      <Box className="episode-list" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {(episodes || []).map((ep, i) => (
          <Button
            key={ep.id || i}
            variant={selectedEpisode === ep.episode_number ? "contained" : "outlined"}
            className={`episode-btn${selectedEpisode === ep.episode_number ? ' active' : ''}`}
            onClick={() => {
              setSelectedEpisode(ep.episode_number);
              const movieRoute = slug || movie.slug || movie.sourceSlug || movie.title_url || movie.id;
              navigate(`/watch/${movieRoute}?ep=${ep.episode_number}`);
            }}
            sx={{
              color: selectedEpisode === ep.episode_number ? '#23242a' : '#fff',
              bgcolor: selectedEpisode === ep.episode_number ? '#FFD600' : 'transparent',
              borderColor: selectedEpisode === ep.episode_number ? '#FFD600' : '#444',
              '&:hover': {
                bgcolor: selectedEpisode === ep.episode_number ? '#ffe082' : 'rgba(255, 214, 0, 0.1)',
                borderColor: '#FFD600',
                color: '#FFD600'
              }
            }}
          >
            Tập {ep.episode_number}
          </Button>
        ))}
      </Box>

      {/* Comments section placeholder */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>Bình luận</Typography>
        <Typography variant="body2" sx={{ color: '#888' }}>
          Tính năng bình luận sẽ được cập nhật trong phiên bản sau.
        </Typography>
      </Box>
    </Box>
  );
};

export default WatchMovie;