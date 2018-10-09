package com.gdssoft.oa.dao.archive.impl;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.archive.OdArchivesccDao;
import com.gdssoft.oa.model.archive.OdArchivescc;

@SuppressWarnings("unchecked")
public class OdArchivesccDaoImpl extends BaseDaoImpl<OdArchivescc> implements
		OdArchivesccDao {

	public OdArchivesccDaoImpl() {
		super(OdArchivescc.class);
	}

}