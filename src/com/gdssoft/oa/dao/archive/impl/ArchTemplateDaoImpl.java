package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.archive.ArchTemplateDao;
import com.gdssoft.oa.model.archive.ArchTemplate;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ArchTemplateDaoImpl extends BaseDaoImpl<ArchTemplate> implements ArchTemplateDao{

	public ArchTemplateDaoImpl() {
		super(ArchTemplate.class);
	}

}