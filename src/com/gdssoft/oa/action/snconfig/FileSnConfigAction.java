package com.gdssoft.oa.action.snconfig;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/ 
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.snconfig.FileSnConfig;
import com.gdssoft.oa.model.snconfig.FlowSnConfig;
import com.gdssoft.oa.service.snconfig.FileSnConfigService;
import com.gdssoft.oa.service.snconfig.FlowSnConfigService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * 
 * @author 
 *
 */
public class FileSnConfigAction extends BaseAction{
	@Resource
	private FileSnConfigService fileSnConfigService;
	@Resource
	private FlowSnConfigService flowSnConfigService;
	private FileSnConfig fileSnConfig;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public FileSnConfig getFileSnConfig() {
		return fileSnConfig;
	}

	public void setFileSnConfig(FileSnConfig fileSnConfig) {
		this.fileSnConfig = fileSnConfig;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		String flowId=getRequest().getParameter("flowId");
		String snName=getRequest().getParameter("snName");
		StringBuffer sb = new StringBuffer();
		if(null!=flowId&&!StringUtils.isEmpty(flowId)){
			QueryFilter filter=new QueryFilter(getRequest());
			filter.addFilter("Q_flowId_L_EQ",flowId);
			List<FlowSnConfig> flowSigns= flowSnConfigService.getAll(filter);
			for(FlowSnConfig flowSnConfig:flowSigns){
				sb.append(flowSnConfig.getSnId()).append(",");
			}
			if (!flowSigns.isEmpty()) {
				sb.deleteCharAt(sb.length() - 1);
			}
		}
		List<FileSnConfig> list=fileSnConfigService.getFileSnExcIds(sb.toString(),snName);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(list.size()).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"createDate", "updateDate",  "expirationDate" });
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				fileSnConfigService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		FileSnConfig cqFileSnConfig=fileSnConfigService.get(id);
		//将数据转成JSON格式
		StringBuffer buff = new StringBuffer("{success:true,data:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"createDate", "updateDate",  "expirationDate" });
		buff.append(json.exclude(new String[] { "class" }).serialize(cqFileSnConfig));
		buff.append("}");
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(fileSnConfig.getId()==null){
			fileSnConfig.setCreateDate(new Date());
			fileSnConfig.setCreateUser(ContextUtil.getCurrentUser().getUsername());
			fileSnConfigService.save(fileSnConfig);
		}else{
			FileSnConfig orgFileSnConfig=fileSnConfigService.get(fileSnConfig.getId());
			try{
				BeanUtil.copyNotNullProperties(orgFileSnConfig, fileSnConfig);
				orgFileSnConfig.setUpdateDate(new Date());
				orgFileSnConfig.setUpdateUser(ContextUtil.getCurrentUser().getUsername());
				fileSnConfigService.save(orgFileSnConfig);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	/**
	 * 获取收发文编号
	 * @return
	 */
	public String getSnNo(){
		
		//如果没有传递defid参数，提示错误
		if(null == getRequest().getParameter("defId")|| StringUtils.isEmpty(getRequest().getParameter("defId").toString())) {
			StringBuffer sb = new StringBuffer("{success:failed,data:'defId is null!'");
			sb.append("}");
			setJsonString(sb.toString());
			return SUCCESS;
		}
		//如果没有snConfigId参数，提示错误
		if(null == getRequest().getParameter("snConfigId") || StringUtils.isEmpty(getRequest().getParameter("snConfigId").toString())) {
			StringBuffer sb = new StringBuffer("{success:failed,data:'snConfigId is null!'");
			sb.append("}");
			setJsonString(sb.toString());
			return SUCCESS;
		}

		//获取编号
		Long defId = new Long(getRequest().getParameter("defId").toString());
		Long snConfigId = new Long(getRequest().getParameter("snConfigId").toString());
		String snNo  = fileSnConfigService.getFlowSnNo(defId, snConfigId);
		StringBuffer sb = new StringBuffer("{success:true,data:'");
		sb.append(snNo + "'");
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	
	/**
	 * 获取跨年收发文编号
	 * @return
	 */
	public String getHistorySnNo(){
		//如果没有传递defid参数，提示错误
		if(null == getRequest().getParameter("defId")|| StringUtils.isEmpty(getRequest().getParameter("defId").toString())) {
			StringBuffer sb = new StringBuffer("{success:failed,data:'defId is null!'");
			sb.append("}");
			setJsonString(sb.toString());
			return SUCCESS;
		}
		//如果没有snConfigId参数，提示错误
		if(null == getRequest().getParameter("snConfigId") || StringUtils.isEmpty(getRequest().getParameter("snConfigId").toString())) {
			StringBuffer sb = new StringBuffer("{success:failed,data:'snConfigId is null!'");
			sb.append("}");
			setJsonString(sb.toString());
			return SUCCESS;
		}
		//如果没有snConfigId参数，提示错误
		if(null == getRequest().getParameter("snYear") || StringUtils.isEmpty(getRequest().getParameter("snYear"))) {
			StringBuffer sb = new StringBuffer("{success:failed,data:'year is null!'");
			sb.append("}");
			setJsonString(sb.toString());
			return SUCCESS;
		}
		
		//获取编号
		Long snConfigId = new Long(getRequest().getParameter("snConfigId").toString());
		String snYear = getRequest().getParameter("snYear");
		String snNo  = fileSnConfigService.getFlowHistorySnNo(snConfigId,snYear);
		StringBuffer sb = new StringBuffer("{success:true,data:'");
		sb.append(snNo + "'");
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	public String signList(){
		QueryFilter filter=new QueryFilter(getRequest());
		filter.addSorted("snType", "asc");
		filter.addSorted("snNumber", "desc");
		List<FileSnConfig> list= fileSnConfigService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"createDate", "updateDate",  "expirationDate" });
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		jsonString=buff.toString();
		return SUCCESS;
	}
	
	public String signCombo(){
		String snType=getRequest().getParameter("snType");
		QueryFilter filter=new QueryFilter(getRequest());
		if(null!=snType&&!snType.equals("")){
		filter.addFilter("Q_snType_L_EQ", snType);
		}
		List<FileSnConfig> list= fileSnConfigService.getAll(filter);
		StringBuffer buff = new StringBuffer("[");
		for(FileSnConfig fsc:list){
			buff.append("['").append(fsc.getId()).append("','")
					.append(fsc.getSnName()).append("']").append(",");
		}
		buff.deleteCharAt(buff.length()-1);
		buff.append("]");
		this.setJsonString(buff.toString());
		return SUCCESS;
	}
}
