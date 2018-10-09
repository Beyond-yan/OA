package com.gdssoft.oa.service.archive.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.archive.ArchivesTypeDao;
import com.gdssoft.oa.model.archive.ArchivesType;
import com.gdssoft.oa.service.archive.ArchivesTypeService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ArchivesTypeServiceImpl extends BaseServiceImpl<ArchivesType> implements ArchivesTypeService{
	private ArchivesTypeDao dao;
	
	public ArchivesTypeServiceImpl(ArchivesTypeDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	public ArchivesType findTypeByName(String name){
		return dao.findTypeByName(name);
	}

}