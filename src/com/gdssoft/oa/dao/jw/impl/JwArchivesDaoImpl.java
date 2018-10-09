package com.gdssoft.oa.dao.jw.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.jw.JwArchivesDao;
import com.gdssoft.oa.model.jw.JwArchives;

@SuppressWarnings("unchecked")
public class JwArchivesDaoImpl extends BaseDaoImpl<JwArchives> implements JwArchivesDao{

	public JwArchivesDaoImpl() {
		super(JwArchives.class);
	}

}