package com.gdssoft.oa.dao.flow.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.flow.ProTypeDao;
import com.gdssoft.oa.model.flow.ProType;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ProTypeDaoImpl extends BaseDaoImpl<ProType> implements ProTypeDao{

	public ProTypeDaoImpl() {
		super(ProType.class);
	}

}