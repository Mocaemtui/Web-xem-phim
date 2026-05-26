import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Chip, Button, Rating } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import "./DetailMovies.css";
import { getMovieDetail } from "../services/sourceManager";

const DetailMovies = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("episodes");
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeEpisodes = (raw = []) => {
    if (!Array.isArray(raw)) return [];
    return raw.map((ep, idx) => {
      const episode_number = ep.episode_number || ep.episodeNumber || ep.episode || ep.ep || (ep.no ? Number(ep.no) : undefined) || (ep.index ? Number(ep.index) : undefined) || (idx + 1);
      return { ...ep, episode_number };
    });
  };

  useEffect(() => {
    const loadMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getMovieDetail(id);
        
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
          setSelectedEpisode(norm[0].episode_number);
        }
      } catch (err) {
        console.error('Error loading movie:', err);
        setError("Không thể tải dữ liệu phim");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadMovie();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress sx={{ color: '#FFD600' }} />
        <Typography sx={{ color: '#fff' }}>Đang tải dữ liệu phim...</Typography>
      </Box>
    );
  }
  if (error || !data) return <Box sx={{color:'#fff',textAlign:'center',marginTop:60}}>{error || "Không tìm thấy phim"}</Box>;

  const imgFallback = 'data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22480%22 height=%22720%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23232a3a%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23fff%22 font-family=%22Arial%22 font-size=%2224%22>No Image</text></svg>';
  const bgImage = data.bg_url || data.poster_url || data.poster || imgFallback;
  const posterSrc = data.poster_url || data.poster || data.posterUrl || imgFallback;

  const rawEpisodes = data.episodes || data.movie?.episodes || [];
  const episodes = normalizeEpisodes(rawEpisodes);

  const handleGenreClick = (genre) => {
    navigate(`/movies?genre=${encodeURIComponent(genre)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCountryClick = (country) => {
    navigate(`/movies?country=${encodeURIComponent(country)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box className="detail-movies-bg">
      <Box className="detail-movies-container">
        <Box className="detail-movies-banner" style={{backgroundImage: `url('${bgImage}')`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
          <Box className="detail-movies-banner-overlay">
            <Box className="detail-movies-content">
              <Box className="detail-movies-poster-section">
                <img className="detail-movies-poster" src={posterSrc} alt={data.title} onError={(e)=>{e.target.onerror=null;e.target.src=imgFallback}} />
                <Box className="detail-movies-info">
                  <Typography variant="h3" className="detail-movies-title">{data.title}</Typography>
                  {data.original_title && (
                    <Typography variant="h6" className="detail-movies-original-title">{data.original_title}</Typography>
                  )}
                  
                  {/* Badges */}
                  <Box className="detail-movies-badges">
                    {data.source && (
                      <Chip
                        label={data.source.toUpperCase()}
                        sx={{
                          bgcolor: '#FFD600',
                          color: '#23242a',
                          fontWeight: 700,
                          fontSize: 11
                        }}
                      />
                    )}
                    {data.imdb_rating && (
                      <Chip
                        icon={<span style={{color: '#f5c518', fontWeight: 700}}>IMDb</span>}
                        label={Number(data.imdb_rating).toFixed(1)}
                        sx={{
                          bgcolor: 'transparent',
                          border: '2px solid #f5c518',
                          color: '#fff',
                          fontWeight: 600,
                          '& .MuiChip-icon': { color: '#f5c518' }
                        }}
                      />
                    )}
                    {data.quality && (
                      <Chip
                        label={data.quality}
                        sx={{
                          bgcolor: 'linear-gradient(135deg, #fff 60%, #ffe082 100%)',
                          color: '#222',
                          fontWeight: 700,
                          fontFamily: 'monospace'
                        }}
                      />
                    )}
                    {data.age_limit && (
                      <Chip
                        label={data.age_limit}
                        sx={{
                          bgcolor: '#fff',
                          color: '#222',
                          fontWeight: 700,
                          fontFamily: 'monospace'
                        }}
                      />
                    )}
                    {data.release_year && (
                      <Chip
                        label={data.release_year}
                        sx={{
                          bgcolor: 'transparent',
                          border: '2px solid #fff',
                          color: '#fff',
                          fontWeight: 700,
                          fontFamily: 'monospace'
                        }}
                      />
                    )}
                    {data.duration && (
                      <Chip
                        label={data.duration}
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
                  <Box className="detail-movies-meta">
                    {data.genres && data.genres.map((g, i) => (
                      <Chip 
                        key={i}
                        label={g}
                        onClick={() => handleGenreClick(g)}
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

                  {/* Extra Info */}
                  <Box className="detail-movies-extra-info">
                    {data.duration && (
                      <Box><span className="extra-label">Thời lượng:</span> {data.duration}</Box>
                    )}
                    {data.countries && data.countries.length > 0 && (
                      <Box>
                        <span className="extra-label">Quốc gia:</span> 
                        {data.countries.map((country, idx) => (
                          <React.Fragment key={idx}>
                            <span 
                              className="extra-link"
                              onClick={() => handleCountryClick(country)}
                              style={{ cursor: 'pointer', color: '#FFD600', '&:hover': { textDecoration: 'underline' } }}
                            >
                              {country}
                            </span>
                            {idx < data.countries.length - 1 && <span>, </span>}
                          </React.Fragment>
                        ))}
                      </Box>
                    )}
                    {data.producers && data.producers.length > 0 && (
                      <Box><span className="extra-label">Sản xuất:</span> {data.producers.join(', ')}</Box>
                    )}
                    {data.directors && data.directors.length > 0 && (
                      <Box><span className="extra-label">Đạo diễn:</span> {data.directors.join(', ')}</Box>
                    )}
                  </Box>

                  {/* Description */}
                  <Box sx={{marginBottom: 0}}>
                    <Typography className={`detail-movies-desc${expanded ? ' expanded' : ''}`}>
                      <span style={{color:'#fff', fontWeight:500,}}>Giới thiệu: </span>
                      <span style={{whiteSpace:'pre-line'}}>{data.description || "Không có mô tả"}</span>
                    </Typography>
                    <Button
                      className={`show-more-btn${expanded ? ' collapse' : ' inline'}`}
                      onClick={() => setExpanded(e => !e)}
                      sx={{mt: 1, ml: 0}}
                    >
                      {expanded ? 'Thu gọn' : 'Hiển thị thêm'}
                      <span style={{fontSize:'1.1em', ml: 1, fontWeight:700}}>{expanded ? '▲' : '▼'}</span>
                    </Button>
                  </Box>

                  {/* Action Buttons */}
                  <Box className="detail-movies-actions-row">
                    <Button 
                      variant="contained"
                      className="detail-movies-watch-btn"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => navigate(`/watch/${id}${selectedEpisode > 1 ? `?ep=${selectedEpisode}` : ''}`)}
                    >
                      Xem Ngay
                    </Button>
                    <Button 
                      variant="outlined"
                      className="action-btn"
                      startIcon={<FavoriteBorderIcon />}
                    >
                      Yêu thích
                    </Button>
                    <Button 
                      variant="outlined"
                      className="action-btn"
                      startIcon={<AddIcon />}
                    >
                      Thêm vào
                    </Button>
                    <Button 
                      variant="outlined"
                      className="action-btn"
                      startIcon={<ShareIcon />}
                    >
                      Chia sẻ
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Box className="detail-movies-tabs">
          <Button className={activeTab === "episodes" ? "active" : ""} onClick={() => setActiveTab("episodes")}>Tập phim</Button>
          <Button className={activeTab === "actors" ? "active" : ""} onClick={() => setActiveTab("actors")}>Diễn viên</Button>
          <Button className={activeTab === "suggested" ? "active" : ""} onClick={() => setActiveTab("suggested")}>Đề xuất</Button>
        </Box>

        {/* Tab Content */}
        {activeTab === "episodes" && (
          <Box className="episode-list">
            {episodes && episodes.length > 0 ? episodes.map((ep, i) => (
              <Button
                key={i}
                className={`episode-btn${selectedEpisode === ep.episode_number ? ' active' : ''}`}
                onClick={() => {
                  setSelectedEpisode(ep.episode_number);
                  navigate(`/watch/${id}?ep=${ep.episode_number}`);
                }}
                startIcon={<PlayArrowIcon />}
              >
                Tập {ep.episode_number}
              </Button>
            )) : <Typography sx={{color:'#fff',margin:'24px 0'}}>Chưa có tập phim</Typography>}
          </Box>
        )}

        {activeTab === "actors" && (
          <Box className="actor-list">
            {data.actors && data.actors.length > 0 ? data.actors.map((actor, idx) => (
              <Box className="actor-card" key={idx}>
                <img className="actor-img" src={actor.profile_pic_url} alt={actor.name} onError={(e)=>{e.target.onerror=null;e.target.src=imgFallback}} />
                <Typography className="actor-name">{actor.name}</Typography>
                {actor.bio && <Typography className="actor-bio">{actor.bio}</Typography>}
              </Box>
            )) : <Typography sx={{color:'#fff',margin:'24px 0'}}>Chưa có diễn viên</Typography>}
          </Box>
        )}

        {activeTab === "suggested" && (
          <Box sx={{ margin: '40px 0 0 0' }}>
            {data.suggested && data.suggested.length > 0 ? (
              <Box sx={{ width: '100%' }}>
                <Box className="movies-list">
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '24px 0' }}>
                    {data.suggested.map((movie, idx) => (
                      <Box
                        className="movies-card-suggest movies-card-item"
                        key={movie.id ? `movie-${movie.id}` : `idx-${idx}`}
                        sx={{ width: 200, margin: '0 12px 32px 12px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => navigate(`/movies/${movie.id}`)}
                      >
                        <Box className="movies-card-imgbox">
                          <img
                              src={movie.poster_url || movie.poster || movie.posterUrl || imgFallback}
                              alt={movie.title}
                              className="movies-card-img"
                              onError={(e)=>{e.target.onerror=null;e.target.src=imgFallback}}
                            />
                          {movie.imdb_rating && (
                            <Chip 
                              label={`IMDb ${Number(movie.imdb_rating).toFixed(1)}`}
                              size="small"
                              sx={{ 
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(0,0,0,0.8)',
                                color: '#f5c518',
                                fontWeight: 600,
                                fontSize: 11
                              }}
                            />
                          )}
                        </Box>
                        <Box className="movies-card-content">
                          <Typography className="movies-card-title">{movie.title}</Typography>
                          {movie.original_title && movie.original_title !== movie.title && (
                            <Typography className="movies-card-original">{movie.original_title}</Typography>
                          )}
                          {movie.release_year && (
                            <Typography sx={{color: '#888', fontSize: 12, mt: 0.5}}>{movie.release_year}</Typography>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography sx={{ color: '#bdbdbd', fontSize: 22, fontWeight: 500, textAlign: 'center' }}>Không có đề xuất</Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DetailMovies; 