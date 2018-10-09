package com.gdssoft.oa.service.jw.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.jw.JwSentArchivesDao;
import com.gdssoft.oa.model.jw.JwSentArchives;
import com.gdssoft.oa.service.jw.JwSentArchivesService;

public class JwSentArchivesServiceImpl extends BaseServiceImpl<JwSentArchives> implements JwSentArchivesService{
	
	private JwSentArchivesDao dao;

	public JwSentArchivesServiceImpl(JwSentArchivesDao dao) {
	    super(dao);
	    this.dao = dao;
	}
}