package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.archive.ArchivesAttendDao;
import com.gdssoft.oa.model.archive.ArchivesAttend;
import com.gdssoft.oa.service.archive.ArchivesAttendService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ArchivesAttendServiceImpl extends BaseServiceImpl<ArchivesAttend> implements ArchivesAttendService{
	private ArchivesAttendDao dao;
	
	public ArchivesAttendServiceImpl(ArchivesAttendDao dao) {
		super(dao);
		this.dao=dao;
	}

}