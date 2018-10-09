package com.gdssoft.core;

import com.gdssoft.core.util.PropertiesFileUtil;

/*
 * 捷达世软件（深圳）有限公司 OA办公自动管理系统   
*/

/**
 * 全应用程序的常量
 * @author csx
 *
 */
public  class Constants {
	/**
	 * 代表禁用
	 */
	public static final Short FLAG_DISABLE = 0;
	/**
	 * 上传的跟路径  add by:tony
	 */
	public static final String UPLOAD_ROOT_PATH="attachFiles";
	/**
	 * 代表激活
	 */
	public static final Short FLAG_ACTIVATION = 1;
	/**
	 * 代表记录删除
	 */
	public static final Short FLAG_DELETED=1;
	/**
	 * 代表未删除记录
	 */
	public static final Short FLAG_UNDELETED=0;
	
	/**
	 * 应用程序的格式化符
	 */
	public static final String DATE_FORMAT_FULL="yyyy-MM-dd HH:mm:ss";
	/**
	 * 短日期格式
	 */
	public static final String DATE_FORMAT_YMD="yyyy-MM-dd"; 
	
	/**
	 * 流程跳转人，可用于在流程跳转使用
	 */
	public static final String FLOW_JUMP_USER="freeJumpUserId";
	
	/**
	 * 流程启动者，可用于在流程定义使用
	 */
	public static final String FLOW_START_USER="flowStartUser";
	
	/**
	 * 流程任务执行过程中，指定了某人执行该任务，该标识会存储于Variable变量的Map中，随流程进入下一步
	 */
	public static final String FLOW_ASSIGN_ID="flowAssignId";
	
	/**
	 * 为会签任务指定多个用户
	 */
	public static final String FLOW_SIGN_USERIDS="signUserIds";
	/**
	 * foreach
	 */
	public static final String FLOW_FOREACH_USERIDS="foreachUserIds";
	/**
	 * foreach
	 */
	public static final String FLOW_FOREACH_USERIDS_LENGTHS="foreachUserIdsLengths";
	/**
	 * fork
	 */
	public static final String FLOW_FORK_USERIDS="forkUserIds";

	public static final String IS_FORK_FLOW="isForkFlow";
	public static final String IS_JOIN_FLOW="isJoinFlow";
	public static final String IS_END_FLOW="isEndFlow";
	public static final String JOIN_NAME="joinName";
	public static final String JOINED_NAME="joinedName";
	public static final String PREV_NAME="prevName";
	/**
	 * 若当前流程节点分配的节点为流程启动者，其userId则为以下值
	 */
	public static final String FLOW_START_ID="__start";
	/**
	 * 若当前流程分配置为当前启动者的上司，则其对应的ID为以下值
	 */
	public static final String FLOW_SUPER_ID="__super";
	
	/**
	 * 流程启动者，可用于在流程定义使用
	 */
	public static final String PUBLIC_SCHEMA_CODE="OA_COMMON";
	
	/**
	 * 调用oa3数据库
	 */
	public static String  PUBLIC_SCHEMA_OA3 = "";
	 static {
		 PUBLIC_SCHEMA_OA3 =PropertiesFileUtil.readValue("Main_Schema");
	 }
	
	/**
	 * 请假流程的key
	 */
	public static final String FLOW_LEAVE_KEY="ReqHolidayOut";
	
	/**
	 * 流程下一步跳转列表常量
	 */
	public static final String FLOW_NEXT_TRANS="nextTrans";
	/**
	 * 公文ID
	 */
	public static final String ARCHIES_ARCHIVESID="archives.archivesId";
	/**
	 * 公司LOGO路径
	 */
	public static final String COMPANY_LOGO="app.logoPath";
	/**
	 * 默认的LOGO
	 */
	public static final String DEFAULT_LOGO="/images/ht-logo.png";
	
	/**
	 * 公司名称
	 */
	public static final String COMPANY_NAME="app.companyName";
	/**
	 * 默认公司的名称
	 */
	public static final String DEFAULT_COMPANYNAME="深圳市地铁三号线运营分公司";
	/**
	 * 通过审核
	 */
	public static final Short FLAG_PASS=1;
	/**
	 * 不通过审核
	 */
	public static final Short FLAG_NOTPASS=2;
	
	/**
	 * 启用
	 */
	public static final Short ENABLED=1;
	/**
	 * 未启用
	 */
	public static final Short UNENABLED=0;	
	
	/**
	 * 公文状态定义
	 * @author F3201253
	 *
	 */
	public interface ArchivesStatus{
		/**
		 * 公文默认状态
		 */
		public static final short DEFAULT = 1;
		/**
		 * 已签发
		 */
		public static final short SIGNED = 2;
		/**
		 * 已生成电子公文
		 */
		public static final short ELECTRONICAL = 3;
		/**
		 * 已归档
		 */
		public static final short FILED = 4;
	}
	/**
	 * 公文状态定义
	 * @author F3201253
	 *
	 */
	public interface DepartmentLevelLimit{
		/**
		 * 公文默认状态
		 */
		public static final int DEFAULT_INNER = 90;
		/**
		 * 已签发
		 */
		public static final int DEFAULT_EXTERNAL = 3;
	}
	/**
	 * 公文状态定义
	 * @author F3201253
	 *
	 */
	public interface ArchivesType{
		/**
		 * 发文
		 */
		public static final short SENTFILES = 0;
		/**
		 * 收文
		 */
		public static final short RECEIVEFILES = 1;
		/**
		 * 督办件
		 */
		public static final short SUPERVISIONFILES = 2;
	}
	

}
