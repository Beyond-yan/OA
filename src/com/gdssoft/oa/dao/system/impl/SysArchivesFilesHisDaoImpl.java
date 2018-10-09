package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.SysArchivesFilesHisDao;
import com.gdssoft.oa.model.system.SysArchivesFilesHis;

@SuppressWarnings("unchecked")
public class SysArchivesFilesHisDaoImpl extends BaseDaoImpl<SysArchivesFilesHis> implements SysArchivesFilesHisDao{

	public SysArchivesFilesHisDaoImpl() {
		super(SysArchivesFilesHis.class);
	}
	
	public void deleteDataId(Long dataId){
		String hql = "delete SysArchivesFilesHis saf where saf.sysDataTransferHis.id = :dataId";
		Query query = this.getSession().createQuery(hql).setParameter("dataId", dataId);
		query.executeUpdate();
	}

}