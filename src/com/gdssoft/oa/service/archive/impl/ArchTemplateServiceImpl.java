package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import javax.annotation.Resource;

import com.gdssoft.oa.dao.archive.ArchTemplateDao;
import com.gdssoft.oa.model.archive.ArchTemplate;
import com.gdssoft.oa.service.archive.ArchTemplateService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ArchTemplateServiceImpl extends BaseServiceImpl<ArchTemplate> implements ArchTemplateService{
	private ArchTemplateDao dao;
	
	@Resource
	FileAttachService fileAttachService;
	
	public ArchTemplateServiceImpl(ArchTemplateDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	/**
	 * 删除该模板时，若存在附件，也需要同时删除附件
	 */
	public void remove(Long id) {
		ArchTemplate template=dao.get(id);
		remove(template);
		fileAttachService.removeByPath(template.getTempPath());
		
	}

}