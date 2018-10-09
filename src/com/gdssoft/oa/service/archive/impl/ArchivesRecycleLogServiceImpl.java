package com.gdssoft.oa.service.archive.impl;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.archive.ArchivesRecycleLogDao;
import com.gdssoft.oa.model.archive.ArchivesRecycleLog;
import com.gdssoft.oa.service.archive.ArchivesRecycleLogService;

public class ArchivesRecycleLogServiceImpl extends BaseServiceImpl<ArchivesRecycleLog> implements ArchivesRecycleLogService {
	private ArchivesRecycleLogDao dao;
	
	public ArchivesRecycleLogServiceImpl(ArchivesRecycleLogDao dao) {
		super(dao);
		this.dao=dao;
	}
}
