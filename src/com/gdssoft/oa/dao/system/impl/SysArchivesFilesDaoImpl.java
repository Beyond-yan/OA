package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.sql.SQLException;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.SysArchivesFilesDao;
import com.gdssoft.oa.model.system.SysArchivesFiles;

@SuppressWarnings("unchecked")
public class SysArchivesFilesDaoImpl extends BaseDaoImpl<SysArchivesFiles> implements SysArchivesFilesDao{

	public SysArchivesFilesDaoImpl() {
		super(SysArchivesFiles.class);
	}
	
	public List<SysArchivesFiles> findByDataId(Long id){
		String hql = "from SysArchivesFiles sa where sa.sysDataTransfer.id=:id";
		Query query = this.getSession().createQuery(hql).setParameter("id", id);
		return query.list();
	}
	
	public List<SysArchivesFiles> findByDataIdAndFileType(Long id,Long fileType){
		String hql = "from SysArchivesFiles sa where sa.sysDataTransfer.id=:id and sa.fileType=:fileType";
		Query query = this.getSession().createQuery(hql).setParameter("id", id).setParameter("fileType", fileType);
		List<SysArchivesFiles> list=query.list();
		if(list.size()>0){
			return list;
		}else{
			return null;
		}
	}
	
	public int removeById(String id, Long dataId,Long fileType){
		String connection = "";
		if(null != dataId){
			connection += "sa.sysDataTransfer.id =:dataId";
		}
		if(null != fileType){
			connection += " and sa.fileType = :fileType ";
		}
		if (null != id && "" !=id){
			connection +="and sa.id not in(";
			String[] ids = id.split(",");
			for(int i = 1; i<=ids.length; i++){
				if(i == ids.length){
					connection += new Long(ids[i-1]);
				}else{
					connection += new Long(ids[i-1]) +",";
				}
			}
			connection += ")";
		}
		String hql = "delete from SysArchivesFiles sa where " + connection;
		Query query=this.getSession().createQuery(hql);
		if(null != dataId){
			query.setParameter("dataId", dataId);
		}
		if(null != fileType){
			query.setParameter("fileType", fileType);
		}
		return query.executeUpdate();
	}

}