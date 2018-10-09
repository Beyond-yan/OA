package com.gdssoft.oa.service.jw.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.jw.JwAttachfileDao;
import com.gdssoft.oa.model.jw.JwAttachfile;
import com.gdssoft.oa.service.jw.JwAttachfileService;

public class JwAttachfileServiceImpl extends BaseServiceImpl<JwAttachfile> implements JwAttachfileService{
	@SuppressWarnings("unused")
	private JwAttachfileDao dao;
	
	public JwAttachfileServiceImpl(JwAttachfileDao dao) {
		super(dao);
		this.dao=dao;
	}

}