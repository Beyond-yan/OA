package com.gdssoft.oa.service.info.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import com.gdssoft.oa.dao.info.NewsCommentDao;
import com.gdssoft.oa.model.info.NewsComment;
import com.gdssoft.oa.service.info.NewsCommentService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class NewsCommentServiceImpl extends BaseServiceImpl<NewsComment> implements NewsCommentService{
	private NewsCommentDao dao;
	
	public NewsCommentServiceImpl(NewsCommentDao dao) {
		super(dao);
		this.dao=dao;
	}

}