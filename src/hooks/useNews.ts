import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { newsService } from '../services/news.service';

export function useNews() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['news'],
    queryFn: ({ pageParam = 1 }) => newsService.getNews(pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length === 0) return undefined;
      return pages.length + 1;
    },
  });

  const { data: featuredNews, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featuredNews'],
    queryFn: newsService.getFeaturedNews,
  });

  return {
    news: data?.pages.flatMap(page => page.data) ?? [],
    featuredNews,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoading || isFeaturedLoading,
  };
}

export function useNewsItem(newsId: string) {
  const { data: news, isLoading } = useQuery({
    queryKey: ['news', newsId],
    queryFn: () => newsService.getNewsById(newsId),
  });

  return {
    news,
    isLoading,
  };
}