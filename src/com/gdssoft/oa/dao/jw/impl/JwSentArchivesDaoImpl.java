package com.gdssoft.oa.dao.jw.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.jw.JwSentArchivesDao;
import com.gdssoft.oa.model.jw.JwSentArchives;

@SuppressWarnings("unchecked")
public class JwSentArchivesDaoImpl extends BaseDaoImpl<JwSentArchives> implements JwSentArchivesDao{

	public JwSentArchivesDaoImpl() {
		super(JwSentArchives.class);
	}
//	public void updateInfo(JwSentArchives jsa){
//		String strSql = "insert into CQ_DOC_FILES_TEMP(title,day,no) values('"+jsa.getSubject()+"','"+jsa.getBumfday()+"','"+jsa.getBumfno()+"')";
//		jdbcTemplate.execute(strSql);
//	}
}