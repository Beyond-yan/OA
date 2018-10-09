package com.gdssoft.oa.dao.admin.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.admin.RegulationDao;
import com.gdssoft.oa.model.admin.Regulation;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

@SuppressWarnings("unchecked")
public class RegulationDaoImpl extends BaseDaoImpl<Regulation> implements RegulationDao{

	public RegulationDaoImpl() {
		super(Regulation.class);
	}

}