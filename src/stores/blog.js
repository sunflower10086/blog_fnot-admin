import { defineStore } from 'pinia'
import { 
  getPostList, 
  getPostDetail, 
  createPost, 
  updatePost, 
  deletePost,
  getCategoryList,
  getTagList,
  createTags,
  deleteTag,
  getTagStats
} from '@/api/blog'

export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: [],
    currentPost: null,
    categories: [],
    tags: [],
    tagStats: [],
    totalPosts: 0,
    loading: false,
    error: null
  }),
  
  getters: {
    getPosts: (state) => state.posts,
    getCurrentPost: (state) => state.currentPost,
    getCategories: (state) => state.categories,
    getTags: (state) => state.tags,
    getTagStats: (state) => state.tagStats,
    isLoading: (state) => state.loading
  },
  
  actions: {
    // 获取文章列表
    async fetchPosts(page = 1, pageSize = 10) {
      this.loading = true
      this.error = null
      try {
        const response = await getPostList({ page, pageSize })
        // 确保即使返回null也转换为空数组
        this.posts = response.posts || []
        this.totalPosts = response.total || 0
        return this.posts
      } catch (error) {
        this.error = error.message || '获取文章列表失败'
        // 确保发生错误时重置为空数组，而不是保留旧数据
        this.posts = []
        this.totalPosts = 0
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取文章详情
    async fetchPostDetail(postId) {
      this.loading = true
      this.error = null
      try {
        const post = await getPostDetail(postId)
        // 将baseInfo中的信息直接提取到currentPost上
        if (post) {
          this.currentPost = {
            ...post,
          }
        } else {
          this.currentPost = post
        }
        return this.currentPost
      } catch (error) {
        this.error = error.message || '获取文章详情失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 创建文章
    async createPost(postData) {
      this.loading = true
      this.error = null
      try {
        const post = await createPost(postData)
        // 刷新文章列表
        this.fetchPosts()
        return post
      } catch (error) {
        this.error = error.message || '创建文章失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 更新文章
    async updatePost(postData) {
      this.loading = true
      this.error = null
      try {
        const post = await updatePost({ post: postData })
        // 如果当前显示的是被更新的文章，更新currentPost
        if (this.currentPost && this.currentPost.id === (post?.id || post.id)) {
          // 将baseInfo中的信息直接提取到currentPost上
          if (post) {
            this.currentPost = {
              ...post,
            }
          } else {
            this.currentPost = post
          }
        }
        // 刷新文章列表
        this.fetchPosts()
        return post
      } catch (error) {
        this.error = error.message || '更新文章失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 删除文章
    async deletePost(postId) {
      this.loading = true
      this.error = null
      try {
        await deletePost(postId)
        // 从列表中移除被删除的文章
        // this.posts = this.posts.filter(p => p.id !== postId)
        // 刷新文章列表
        this.fetchPosts()
        return true
      } catch (error) {
        this.error = error.message || '删除文章失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取分类列表
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        const response = await getCategoryList()
        this.categories = response.categories || []
        return this.categories
      } catch (error) {
        this.error = error.message || '获取分类列表失败'
        this.categories = []
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取标签列表
    async fetchTags() {
      this.loading = true
      this.error = null
      try {
        const response = await getTagList()
        this.tags = response.tags || []
        return this.tags
      } catch (error) {
        this.error = error.message || '获取标签列表失败'
        this.tags = []
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 创建标签
    async createTags(names) {
      this.loading = true
      this.error = null
      try {
        await createTags({ names })
        // 刷新标签列表
        this.fetchTags()
        return true
      } catch (error) {
        this.error = error.message || '创建标签失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 删除标签
    async deleteTag(id) {
      this.loading = true
      this.error = null
      try {
        await deleteTag(id)
        // 刷新标签列表
        this.fetchTags()
        return true
      } catch (error) {
        this.error = error.message || '删除标签失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取标签统计
    async fetchTagStats() {
      this.loading = true
      this.error = null
      try {
        const response = await getTagStats()
        this.tagStats = response.tagStat || []
        return this.tagStats
      } catch (error) {
        this.error = error.message || '获取标签统计失败'
        this.tagStats = []
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 