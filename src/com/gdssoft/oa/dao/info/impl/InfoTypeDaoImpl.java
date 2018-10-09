package com.gdssoft.oa.dao.info.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.info.InfoTypeDao;
import com.gdssoft.oa.model.info.InfoType;

@SuppressWarnings("unchecked")
public class InfoTypeDaoImpl extends BaseDaoImpl<InfoType> implements InfoTypeDao{

	public InfoTypeDaoImpl() {
		super(InfoType.class);
	}

}