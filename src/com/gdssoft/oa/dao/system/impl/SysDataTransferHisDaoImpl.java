package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.SysDataTransferHisDao;
import com.gdssoft.oa.model.system.SysDataTransferHis;

@SuppressWarnings("unchecked")
public class SysDataTransferHisDaoImpl extends BaseDaoImpl<SysDataTransferHis> implements SysDataTransferHisDao{

	public SysDataTransferHisDaoImpl() {
		super(SysDataTransferHis.class);
	}
	
	public List<SysDataTransferHis> findByHisId(Long hisId){
		String hql = "from SysDataTransferHis sdt where sdt.hisId = :hisId";
		Query query = this.getSession().createQuery(hql).setParameter("hisId", hisId);
		return query.list();
	}

}