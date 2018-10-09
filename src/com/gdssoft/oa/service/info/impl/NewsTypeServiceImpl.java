package com.gdssoft.oa.service.info.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;

import com.gdssoft.oa.dao.info.NewsTypeDao;
import com.gdssoft.oa.model.info.NewsType;
import com.gdssoft.oa.service.info.NewsTypeService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;


public class NewsTypeServiceImpl extends BaseServiceImpl<NewsType> implements NewsTypeService{
	private NewsTypeDao newsTypeDao;
	
	public NewsTypeServiceImpl(NewsTypeDao dao) {
		super(dao);
		this.newsTypeDao=dao;
	}

	@Override
	public Short getTop() {
		return newsTypeDao.getTop();
	}

	@Override
	public NewsType findBySn(Short sn) {
		return newsTypeDao.findBySn(sn);
	}

	@Override
	public List<NewsType> getAllBySn() {
		return newsTypeDao.getAllBySn();
	}

	@Override
	public List<NewsType> getAllBySn(PagingBean pb) {
		return newsTypeDao.getAllBySn(pb);
	}

	@Override
	public List<NewsType> findBySearch(NewsType newsType, PagingBean pb) {
		return newsTypeDao.findBySearch(newsType, pb);
	}
	
}
