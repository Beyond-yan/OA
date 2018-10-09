package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.archive.OdCirUserDao;
import com.gdssoft.oa.model.archive.OdCirUser;
import com.gdssoft.oa.service.archive.OdCirUserService;

public class OdCirUserServiceImpl extends BaseServiceImpl<OdCirUser> implements OdCirUserService{
	private OdCirUserDao dao;
	
	public OdCirUserServiceImpl(OdCirUserDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<OdCirUser> getListByCirPaperId(Long cirPaperId) {
		// TODO Auto-generated method stub
		return dao.getListByCirPaperId(cirPaperId);
	}

	@Override
	public Long getRunIdByTadkId(Long taskId) {
		// TODO Auto-generated method stub
		return dao.getRunIdByTadkId(taskId);
	}

	@Override
	public List<Long> getByUserAndRun(Long runId, Long userId) {
		// TODO Auto-generated method stub
		return dao.getByUserAndRun(runId, userId);
	}

	@Override
	public List<OdCirUser> searchBySender(Long senderUserId,String subject,String senderName,String recName,String isRead,PagingBean pb) {
		// TODO Auto-generated method stub
		return dao.searchBySender(senderUserId, subject, senderName, recName, isRead, pb);
	}

	@Override
	public List<OdCirUser> searchByPaperId(Long senderUserId, Long cirPaperId,
			PagingBean pb) {
		// TODO Auto-generated method stub
		return dao.searchByPaperId(senderUserId, cirPaperId, pb);
	}

}