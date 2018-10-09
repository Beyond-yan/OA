package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import com.gdssoft.oa.dao.system.ReportTemplateDao;
import com.gdssoft.oa.model.system.ReportTemplate;
import com.gdssoft.oa.service.system.ReportTemplateService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ReportTemplateServiceImpl extends BaseServiceImpl<ReportTemplate> implements ReportTemplateService{
	private ReportTemplateDao dao;
	
	public ReportTemplateServiceImpl(ReportTemplateDao dao) {
		super(dao);
		this.dao=dao;
	}

}