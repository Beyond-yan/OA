package com.gdssoft.oa.action.archive;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.archive.DocExtHistory;
import com.gdssoft.oa.service.archive.DocExtHistoryService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;



import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class DocExtHistoryAction extends BaseAction{
	@Resource
	private DocExtHistoryService docExtHistoryService;
	private DocExtHistory docExtHistory;
	
	private Long historyId;

	public Long getHistoryId() {
		return historyId;
	}

	public void setHistoryId(Long historyId) {
		this.historyId = historyId;
	}

	public DocExtHistory getDocHistory() {
		return docExtHistory;
	}

	public void setDocHistory(DocExtHistory docHistory) {
		this.docExtHistory = docHistory;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<DocExtHistory> list= docExtHistoryService.getAll(filter);
		
		//Type type=new TypeToken<List<DocHistory>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		//Gson gson=new Gson();
		//buff.append(gson.toJson(list, type));
		JSONSerializer json = JsonUtil.getJSONSerializer("updatetime");
		buff.append(json.serialize(list));
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
				docExtHistoryService.remove(new Long(id));
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
		DocExtHistory docHistory=docExtHistoryService.get(historyId);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(docHistory));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		docExtHistoryService.save(docExtHistory);
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
