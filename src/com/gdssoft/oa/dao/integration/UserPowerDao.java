package com.gdssoft.oa.dao.integration;

import org.springframework.stereotype.Service;

import com.gdssoft.oa.dao.common.BaseDao;

@Service
public class UserPowerDao extends BaseDao {
	
	
	//根据ID获取userName
	@SuppressWarnings("unchecked")
	public <T> T queryUserName(String statementName, String userid){
		return  (T) sqlMapClientTemplate .queryForObject(statementName+".queryUserName", userid);
	}
	//验证用户是否存在
	public boolean queryByPoweId(String statementName,String poweId){
		return  (boolean) sqlMapClientTemplate.queryForObject(statementName+".queryByPoweId", poweId);
	}

}
