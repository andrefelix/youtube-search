import axios, { AxiosInstance } from 'axios';
import { YoutubeDataAPIVideoListItem } from '../interfaces/youtubeDataAPIVideoListItem';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    key: process.env.DATA_API_KEY
  }
});

interface YoutubeDataAPIVideosList {
  items: Array<YoutubeDataAPIVideoListItem>;
}

interface YoutubeDataAPISearchListItem {
  id: { videoId: string };
}

interface YoutubeDataAPISearchList {
  items: Array<YoutubeDataAPISearchListItem>;
}

interface YoutubeDataAPIServiceInterface {
  searchByTerm(searchTerm: string): Promise<YoutubeDataAPISearchList>;
  videosByIDs(ids: Array<string>): Promise<YoutubeDataAPIVideosList>;
}

const YoutubeDataAPIService = (): YoutubeDataAPIServiceInterface => {
  const searchByTerm = async (
    searchTerm: string
  ): Promise<YoutubeDataAPISearchList> => {
    const response = await axiosInstance.get('/search', {
      params: {
        maxResults: 50,
        type: 'video',
        videoEmbeddable: 'true',
        q: searchTerm
      }
    });

    return response.data;
  };

  const videosByIDs = async (
    ids: Array<string>
  ): Promise<YoutubeDataAPIVideosList> => {
    const response = await axiosInstance.get('/videos', {
      params: { part: 'snippet,contentDetails,player', id: ids.join(',') }
    });
    return response.data;
  };

  return { searchByTerm, videosByIDs };
};

export { YoutubeDataAPIService };
