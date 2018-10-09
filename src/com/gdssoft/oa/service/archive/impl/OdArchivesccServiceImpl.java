package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.archive.OdArchivesccDao;
import com.gdssoft.oa.model.archive.OdArchivescc;
import com.gdssoft.oa.service.archive.OdArchivesccService;

public class OdArchivesccServiceImpl extends BaseServiceImpl<OdArchivescc> implements OdArchivesccService{
	
	private OdArchivesccDao dao;
	
	public OdArchivesccServiceImpl(OdArchivesccDao dao) {
		super(dao);
		this.dao=dao;
	}
/*	@Override
	public boolean saveread(OdArchivescc odarchiveiscc){
		return dao.saveread(odarchiveiscc);
	}*/
}