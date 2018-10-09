package com.gdssoft.oa.service.archive.impl;
/*
 *捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.archive.ArchRecTypeDao;
import com.gdssoft.oa.model.archive.ArchRecType;
import com.gdssoft.oa.service.archive.ArchRecTypeService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ArchRecTypeServiceImpl extends BaseServiceImpl<ArchRecType> implements ArchRecTypeService{
	private ArchRecTypeDao dao;
	
	public ArchRecTypeServiceImpl(ArchRecTypeDao dao) {
		super(dao);
		this.dao=dao;
	}

}