package com.gdssoft.oa.service.flow.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.flow.ProTypeDao;
import com.gdssoft.oa.model.flow.ProType;
import com.gdssoft.oa.service.flow.ProTypeService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ProTypeServiceImpl extends BaseServiceImpl<ProType> implements ProTypeService{
	private ProTypeDao dao;
	
	public ProTypeServiceImpl(ProTypeDao dao) {
		super(dao);
		this.dao=dao;
	}

}