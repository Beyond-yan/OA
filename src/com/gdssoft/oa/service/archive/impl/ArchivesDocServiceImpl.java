package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.archive.ArchivesDocDao;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.service.archive.ArchivesDocService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
public class ArchivesDocServiceImpl extends BaseServiceImpl<ArchivesDoc> implements ArchivesDocService{
	private ArchivesDocDao dao;
	
	public ArchivesDocServiceImpl(ArchivesDocDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<ArchivesDoc> findByAid(Long archivesId) {
		return dao.findByAid(archivesId);
	}

}