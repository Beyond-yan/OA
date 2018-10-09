package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.system.ReportTemplateDao;
import com.gdssoft.oa.model.system.ReportTemplate;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ReportTemplateDaoImpl extends BaseDaoImpl<ReportTemplate> implements ReportTemplateDao{

	public ReportTemplateDaoImpl() {
		super(ReportTemplate.class);
	}

}