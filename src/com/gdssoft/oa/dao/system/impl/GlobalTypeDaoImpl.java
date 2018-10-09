package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.List;

import com.gdssoft.oa.dao.system.GlobalTypeDao;
import com.gdssoft.oa.model.system.GlobalType;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class GlobalTypeDaoImpl extends BaseDaoImpl<GlobalType> implements GlobalTypeDao{

	public GlobalTypeDaoImpl() {
		super(GlobalType.class);
	}
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.dao.system.GlobalTypeDao#getByParentIdCatKey(java.lang.Long, java.lang.String)
	 */
	public List<GlobalType> getByParentIdCatKey(Long parentId,String catKey){
		String hql=" from GlobalType gt where gt.parentId = ? and gt.catKey = ? order by gt.sn asc";
		return findByHql(hql, new Object[]{parentId,catKey});
	}
	
	public Integer getCountsByParentId(Long parentId){
		ArrayList param=new ArrayList();
		String hql= " select count(proTypeId) from GlobalType gt ";
		if(parentId!=null && parentId!=0){
			hql+=" where gt.parentId=?";
			param.add(parentId);
		}else{
			hql+=" where gt.parentId is null";
		}
		
		Object obj=findUnique(hql, param.toArray());
		return new Integer(obj.toString());
		
	}
	
	public List<GlobalType> getByParentId(Long parentId){
		ArrayList param=new ArrayList();
		String hql= " from GlobalType gt ";
		if(parentId!=null && parentId!=0){
			hql+=" where gt.parentId=?";
			param.add(parentId);
		}else{
			hql+=" where gt.parentId is null";
		}
		
		return findByHql(hql, param.toArray());
	}
	
	/**
	 * 
	 * @param path
	 * @return
	 */
	public List<GlobalType> getByPath(String path){
		String hql=" from GlobalType gt where gt.path like ?";
		return findByHql(hql,new Object[]{path+"%"});
	}
	@Override
	public GlobalType findByTypeName(String typeName) {
		String hql=" from GlobalType gt where gt.typeName = ?";
		List<GlobalType> list = findByHql(hql,new Object[]{typeName});
		if(list.size()>0){
			return list.get(0);
		}else{
			return null;
		}
		
	}

}