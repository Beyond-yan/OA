package com.gdssoft.oa.service.archive.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.archive.ArchivesHandleDao;
import com.gdssoft.oa.model.archive.ArchivesHandle;
import com.gdssoft.oa.service.archive.ArchivesHandleService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
public class ArchivesHandleServiceImpl extends BaseServiceImpl<ArchivesHandle> implements ArchivesHandleService{
	private ArchivesHandleDao dao;
	
	public ArchivesHandleServiceImpl(ArchivesHandleDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public ArchivesHandle findByUAIds(Long userId, Long archiveId) {
		return dao.findByUAIds(userId, archiveId);
	}

	@Override
	public List<ArchivesHandle> findByAid(Long archiveId) {
		return dao.findByAid(archiveId);
	}

	@Override
	public int countHandler(Long archiveId) {
		return dao.findByAid(archiveId).size();
	}

}