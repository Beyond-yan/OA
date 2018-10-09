package com.gdssoft.oa.service.integration;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.gdssoft.oa.model.integration.FlowAuditLogModel;
import com.gdssoft.oa.service.common.BaseService;
@Service
public interface UserPowerService extends BaseService{
	
	//获取审核日志
	public List<FlowAuditLogModel> queryAuditLog(Map<String, Object> param);
	//查询用户名
	public String queryUserName(String userid);
	//验证用户
	public boolean queryByPoweId(String poweId);
}
