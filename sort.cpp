#include<bits/stdc++.h>
using namespace std;

void bubblesort(vector<int>&v){
    int n=v.size();
    for( int i=0; i<n-1; i++){
        for( int j=0; j<n-1-i; j++){
            if(v[i]>v[i+1]){
                swap(v[i],v[i+1]);
            }
        }
    }
}

int main(){
    int n; cin>>n;
    vector<int>v;
    v.resize(n);
    for(int i=0; i<n; i++)cin>>v[i];

    bubblesort(v);

    for( auto x:v){
        cout<< x  <<" ";
    }
    return 0;
}