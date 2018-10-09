package com.gdssoft.oa.dao.document.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.document.PaintTemplateDao;
import com.gdssoft.oa.model.document.PaintTemplate;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

@SuppressWarnings("unchecked")
public class PaintTemplateDaoImpl extends BaseDaoImpl<PaintTemplate> implements PaintTemplateDao{

	public PaintTemplateDaoImpl() {
		super(PaintTemplate.class);
	}

}