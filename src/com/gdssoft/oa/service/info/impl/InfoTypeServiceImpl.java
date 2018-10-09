package com.gdssoft.oa.service.info.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.info.InfoTypeDao;
import com.gdssoft.oa.model.info.InfoType;
import com.gdssoft.oa.service.info.InfoTypeService;

public class InfoTypeServiceImpl extends BaseServiceImpl<InfoType> implements InfoTypeService{
	@SuppressWarnings("unused")
	private InfoTypeDao dao;
	
	public InfoTypeServiceImpl(InfoTypeDao dao) {
		super(dao);
		this.dao=dao;
	}

}