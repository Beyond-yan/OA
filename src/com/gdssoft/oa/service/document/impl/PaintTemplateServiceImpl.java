package com.gdssoft.oa.service.document.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.document.PaintTemplateDao;
import com.gdssoft.oa.model.document.PaintTemplate;
import com.gdssoft.oa.service.document.PaintTemplateService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class PaintTemplateServiceImpl extends BaseServiceImpl<PaintTemplate> implements PaintTemplateService{
	@SuppressWarnings("unused")
	private PaintTemplateDao dao;
	
	public PaintTemplateServiceImpl(PaintTemplateDao dao) {
		super(dao);
		this.dao=dao;
	}

}