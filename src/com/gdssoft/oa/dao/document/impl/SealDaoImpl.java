package com.gdssoft.oa.dao.document.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.document.SealDao;
import com.gdssoft.oa.model.document.Seal;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

@SuppressWarnings("unchecked")
public class SealDaoImpl extends BaseDaoImpl<Seal> implements SealDao{

	public SealDaoImpl() {
		super(Seal.class);
	}

}