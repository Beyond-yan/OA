package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;

import com.gdssoft.oa.dao.system.SysConfigDao;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class SysConfigDaoImpl extends BaseDaoImpl<SysConfig> implements SysConfigDao{

	public SysConfigDaoImpl() {
		super(SysConfig.class);
	}

	@Override
	public SysConfig findByKey(String key) {
		String hql="from SysConfig vo where vo.configKey=?";
		Object[] objs={key};
		List<SysConfig> list=findByHql(hql, objs);
		return (SysConfig)list.get(0);
	}

	@Override
	public List<SysConfig> findConfigByTypeKey(String typeKey) {
		String hql="from SysConfig vo where vo.typeKey=?";
		Object[] objs={typeKey};
		return findByHql(hql, objs);
	}

	@Override
	public List<SysConfig> findTypeKeys() {
		String sql="select vo.typeKey from SysConfig vo group by vo.typeKey";
		return findByHql(sql);
	}
	
	@Override
	public SysConfig findDataValueByTkCkey(String typeKey,String configKey) {
		String hql="from SysConfig vo where vo.typeKey=? and vo.configKey=?";
		Object[] objs={typeKey,configKey};
		List<SysConfig> list=findByHql(hql, objs);
		if(list.size()!=0){
			return (SysConfig)list.get(0);
		}else {
			return null;
		}
		
	}

	@Override
	public SysConfig findDataValueByDtCkey(String dataType, String configKey) {
		// TODO Auto-generated method stub
		String hql="from SysConfig vo where vo.dataType=? and vo.configKey=?";
		Object[] objs={dataType,configKey};
		List<SysConfig> list=findByHql(hql, objs);
		if(list.size()!=0){
			return (SysConfig)list.get(0);
		}else {
			return null;
		}
	}

	@Override
	public SysConfig findDataValueByTkCkeyWithSchema(String schema, String typeKey,
			String configKey) {
		if(StringUtils.isNotBlank(schema)) schema = schema + ".";
		String sql ="select a.* from " + schema + "SYS_CONFIG a where a.typeKey = :typeKey and a.configKey = :configKey";
		Query query = this.getSession().createSQLQuery(sql).addEntity("a", SysConfig.class)
				.setParameter("typeKey", typeKey).setParameter("configKey", configKey);
		List<SysConfig> list = query.list();
		if(list.size()>0){
			return list.get(0);
		}else{
			return null;
		}
	}
	
}