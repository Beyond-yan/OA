package com.gdssoft.oa.service.info.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.dao.info.NewsDao;
import com.gdssoft.oa.model.info.News;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.info.NewsService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class NewsServiceImpl extends BaseServiceImpl<News> implements NewsService{
	private NewsDao newsDao;
	
	public NewsServiceImpl(NewsDao dao) {
		super(dao);
		this.newsDao=dao;
	}

	@Override
	public List<News> findByTypeId(Long typeId,PagingBean pb) {
		return newsDao.findByTypeId(typeId,pb);
	}

	@Override
	public List<News> findBySearch(String searchContent,PagingBean pb) {
		return newsDao.findBySearch(searchContent,pb);
	}
	//add by smart on 20110520
	@Override
	public List<News> findBySearch(String searchContent,Integer auditingStatus,PagingBean pb) {
		return newsDao.findBySearch(searchContent,auditingStatus,pb);
	}

	@Override
	public List<News> findImageNews(PagingBean pb) {
		return newsDao.findImageNews(pb);
	}
	@Override
	public List<News> getDaibanNews(AppUser user,PagingBean pb) 
	{
		return newsDao.getDaibanNews(user, pb);
	}

}
