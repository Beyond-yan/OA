package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.archive.OdCommonCommentsDao;
import com.gdssoft.oa.model.archive.OdCommonComments;
import com.gdssoft.oa.service.archive.OdCommonCommentsService;

public class OdCommonCommentsServiceImpl extends BaseServiceImpl<OdCommonComments> implements OdCommonCommentsService{
	private OdCommonCommentsDao dao;
	
	public OdCommonCommentsServiceImpl(OdCommonCommentsDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<OdCommonComments> getCommentsForSelector(Long userId,String commentType,
			String commentTitle, PagingBean pb) {
		// TODO Auto-generated method stub
		return dao.getCommentsForSelector(userId,commentType,commentTitle, pb);
	}

}