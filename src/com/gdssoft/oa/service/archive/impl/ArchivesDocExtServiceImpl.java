package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.archive.ArchivesDocExtDao;
import com.gdssoft.oa.model.archive.ArchivesDocExt;
import com.gdssoft.oa.service.archive.ArchivesDocExtService;
public class ArchivesDocExtServiceImpl extends BaseServiceImpl<ArchivesDocExt> implements ArchivesDocExtService{
	private ArchivesDocExtDao dao;
	
	public ArchivesDocExtServiceImpl(ArchivesDocExtDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<ArchivesDocExt> findByAid(Long archivesId) {
		return dao.findByAid(archivesId);
	}

}