package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.archive.ArchDispatchDao;
import com.gdssoft.oa.model.archive.ArchDispatch;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.ArchDispatchService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class ArchDispatchServiceImpl extends BaseServiceImpl<ArchDispatch> implements ArchDispatchService{
	private ArchDispatchDao dao;
	
	public ArchDispatchServiceImpl(ArchDispatchDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<ArchDispatch> findByUser(AppUser user, PagingBean pb) {
		return dao.findByUser(user, pb);
	}

	@Override
	public int countArchDispatch(Long archivesId) {
		return dao.findRecordByArc(archivesId).size();
	}

}