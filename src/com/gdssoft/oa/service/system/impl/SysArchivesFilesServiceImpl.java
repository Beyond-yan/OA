package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.SysArchivesFilesDao;
import com.gdssoft.oa.model.system.SysArchivesFiles;
import com.gdssoft.oa.service.system.SysArchivesFilesService;

public class SysArchivesFilesServiceImpl extends BaseServiceImpl<SysArchivesFiles> implements SysArchivesFilesService{
	@SuppressWarnings("unused")
	private SysArchivesFilesDao dao;
	
	public SysArchivesFilesServiceImpl(SysArchivesFilesDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	public List<SysArchivesFiles> findByDataId(Long id){
		return dao.findByDataId(id);
	}
	
	public List<SysArchivesFiles> findByDataIdAndFileType(Long id,Long fileType){
		return dao.findByDataIdAndFileType(id, fileType);
	}
	
	public int removeById(String id, Long dataId,Long fileType){
		return dao.removeById(id, dataId, fileType);
	}

}