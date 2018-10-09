package com.gdssoft.oa.dao.flow.impl;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javassist.expr.NewArray;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.flow.ProDefinitionDao;
import com.gdssoft.oa.model.flow.ProDefinition;

public class ProDefinitionDaoImpl extends BaseDaoImpl<ProDefinition> implements
		ProDefinitionDao {

	public ProDefinitionDaoImpl() {
		super(ProDefinition.class);
	}

	public ProDefinition getByDeployId(String deployId) {
		String hql = "from ProDefinition pd where pd.deployId=?";
		return (ProDefinition) findUnique(hql, new Object[] { deployId });
	}

	public ProDefinition getByName(String name) {
		String hql = "from ProDefinition pd where pd.name=?";
		return (ProDefinition) findUnique(hql, new Object[] { name });
	}

	public List<ProDefinition> getProDefinitions(Long typeId) {
		String hql = "from ProDefinition pd where pd.proType.typeId=?";
		return findByHql(hql, new Object[] { typeId });
	}
	
	public Map<Long,String> getProDefinitionMap(Long typeId){
		String sql = "select defid,name from PRO_DEFINITION";
		if(null != typeId)
			sql+= " where typeid=" +typeId;
		List list = this.getSession().createSQLQuery(sql).list();
		Map<Long, String> mapProDef = new HashMap<Long, String>();
		for(int i =0 ;i<list.size();i++){
			Object[] objects = (Object[])list.get(i);
			mapProDef.put(new Long(objects[0].toString()), objects[1].toString());
		}
		//System.out.println("map:" + mapProDef);
		return mapProDef;
	}

	public List<ProDefinition> getProDefinitions(String typename,
			String typeNametep, PagingBean pb) {
		String hql = "from ProDefinition pd where pd.proType.typeName!=? and pd.proType.typeName!=? ";
		List<ProDefinition> list =new ArrayList<ProDefinition>();
		if(pb==null){
			list= findByHql(hql, new Object[] { typename,
					typeNametep });	
		}else {
			list= findByHql(hql, new Object[] { typename,
					typeNametep }, pb);
		}
		System.out.println("--------list-----" + list.size());
		return list;
	}
	
	public List getProDefinitionList(Long typeId){
		String sql = "select defid,name from PRO_DEFINITION";
		if(null != typeId)
			sql+= " where typeid=" +typeId;
		List list = this.getSession().createSQLQuery(sql).list();		
		return list;
	}

}