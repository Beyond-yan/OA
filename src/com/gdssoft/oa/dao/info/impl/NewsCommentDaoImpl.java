package com.gdssoft.oa.dao.info.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.info.NewsCommentDao;
import com.gdssoft.oa.model.info.NewsComment;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class NewsCommentDaoImpl extends BaseDaoImpl<NewsComment> implements NewsCommentDao{

	public NewsCommentDaoImpl() {
		super(NewsComment.class);
	}

}