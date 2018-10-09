package com.gdssoft.oa.service.admin.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.admin.AssetsTypeDao;
import com.gdssoft.oa.model.admin.AssetsType;
import com.gdssoft.oa.service.admin.AssetsTypeService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class AssetsTypeServiceImpl extends BaseServiceImpl<AssetsType> implements AssetsTypeService{
	@SuppressWarnings("unused")
	private AssetsTypeDao dao;
	
	public AssetsTypeServiceImpl(AssetsTypeDao dao) {
		super(dao);
		this.dao=dao;
	}

}