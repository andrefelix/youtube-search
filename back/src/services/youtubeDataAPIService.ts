import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    key: process.env.DATA_API_KEY
  }
});

interface YoutubeDataAPIVideosList {
  snippet: { title: string; description: string };
  fileDetails: { durationMs: number };
}

interface YoutubeDataAPISearchListItem {
  id: { videoId: string };
}

interface YoutubeDataAPISearchList {
  items: Array<YoutubeDataAPISearchListItem>;
}

interface YoutubeDataAPIServiceInterface {
  searchByTerm(searchTerm: string): Promise<YoutubeDataAPISearchList>;
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

  return { searchByTerm };
};

export { YoutubeDataAPIService };
