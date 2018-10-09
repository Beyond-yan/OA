package com.gdssoft.oa.dao.jw.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.jw.JwSentDocsDao;
import com.gdssoft.oa.model.jw.JwSentDocs;

@SuppressWarnings("unchecked")
public class JwSentDocsDaoImpl extends BaseDaoImpl<JwSentDocs> implements JwSentDocsDao{

	public JwSentDocsDaoImpl() {
		super(JwSentDocs.class);
	}

}