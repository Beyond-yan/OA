package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import org.hibernate.Query;

import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.dao.impl.GenericDaoImpl;
import com.gdssoft.oa.dao.archive.ArchivesTypeDao;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesType;

public class ArchivesTypeDaoImpl extends BaseDaoImpl<ArchivesType> implements ArchivesTypeDao{

	public ArchivesTypeDaoImpl() {
		super(ArchivesType.class);
	}
	
	public ArchivesType findTypeByName(String name){
		
		String hsql = "from ArchivesType at where at.typeName=:typeName";
		Query query = getSession().createQuery(hsql).setParameter("typeName", name);
		List<ArchivesType> typeList = query.list();
		if(typeList.size()>0)
			return typeList.get(0);
		return null;
	}
	public ArchivesType findTypeByArchivesId(Long archivesId){
		String sql = "select d.TYPEID,d.TYPENAME,d.TYPEDESC from " + Constants.PUBLIC_SCHEMA_OA3+".ARCHIVES_TYPE d where d.TYPEID=( select TYPEID from "+
	      Constants.PUBLIC_SCHEMA_OA3+".ARCHIVES a where a.ARCHIVESID="+archivesId+")";
		Query q = this.getSession().createSQLQuery(sql);
		List list=q.list();
		ArchivesType archivesType=new ArchivesType();
		if(list.size()>0){
			Object[] objs = (Object[])list.get(0);
		    archivesType.setTypeId(new Long(objs[0].toString()));
		    archivesType.setTypeName(objs[1].toString());
		    //archivesType.setTypeDesc(objs[2].toString());
		}
		return archivesType;
	}

}